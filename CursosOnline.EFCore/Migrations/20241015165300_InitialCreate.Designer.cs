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
    [Migration("20241015165300_InitialCreate")]
    partial class InitialCreate
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

                    b.Property<string>("Titulo")
                        .HasColumnType("TEXT");

                    b.HasKey("AulaID");

                    b.ToTable("Aulas");
                });
#pragma warning restore 612, 618
        }
    }
}
