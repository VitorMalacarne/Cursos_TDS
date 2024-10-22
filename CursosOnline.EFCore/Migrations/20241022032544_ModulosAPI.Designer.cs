﻿// <auto-generated />
using System;
using CursosOnline.EFCore.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CursosOnline.EFCore.Migrations
{
    [DbContext(typeof(CursosOnlineEFCoreContext))]
    [Migration("20241022032544_ModulosAPI")]
    partial class ModulosAPI
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("CursosOnline.Modelo.Aula", b =>
                {
                    b.Property<int>("AulaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Conteudo")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan?>("Duracao")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ModuloID")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Titulo")
                        .HasColumnType("TEXT");

                    b.HasKey("AulaID");

                    b.HasIndex("ModuloID");

                    b.ToTable("Aulas");
                });

            modelBuilder.Entity("CursosOnline.Modelo.Modulo", b =>
                {
                    b.Property<int>("ModuloID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Nome")
                        .HasColumnType("TEXT");

                    b.HasKey("ModuloID");

                    b.ToTable("Modulos");
                });

            modelBuilder.Entity("CursosOnline.Modelo.Aula", b =>
                {
                    b.HasOne("CursosOnline.Modelo.Modulo", null)
                        .WithMany("Aulas")
                        .HasForeignKey("ModuloID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CursosOnline.Modelo.Modulo", b =>
                {
                    b.Navigation("Aulas");
                });
#pragma warning restore 612, 618
        }
    }
}
